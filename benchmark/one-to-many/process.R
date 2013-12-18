#! /usr/bin/env Rscript

# *******************************************************************************
# * Copyright (c) 18-dec-2013 University of Bologna
# * All rights reserved. This program and the accompanying materials
# * are made available under the terms of the Eclipse Public License v1.0
# * and Eclipse Distribution License v1.0 which accompany this distribution.
# *
# * The Eclipse Public License is available at 
# *    http://www.eclipse.org/legal/epl-v10.html
# * and the Eclipse Distribution License is available at 
# *   http://www.eclipse.org/org/documents/edl-v10.php.
# *
# * Contributors:
# *    Matteo Collina - initial API and implementation and/or initial documentation
# *******************************************************************************

args <- commandArgs(TRUE)
dfrm <- read.csv(args[1])
columns <- factor(colnames(dfrm))
colors <- c("red", "blue", "green")
lines <- c("solid", "solid")

quartz("Ponte")
matplot(dfrm, type="l", pch=as.integer(columns),
        col=colors, lty=lines,
        xlab=args[2], ylab=args[3],
        lwd=5,
        cex.lab=1.5,
        cex.axis=1.5,
        cex.main=1.5,
        cex.sub=1.5
        )

grid()
legend(as.integer(args[4]), as.integer(args[5]),
       as.character(columns),
       col=colors, lty=lines)

dev.copy(pdf,args[6])
dev.off()

#message("Press Return To Continue")
#invisible(readLines("stdin", n=1))
